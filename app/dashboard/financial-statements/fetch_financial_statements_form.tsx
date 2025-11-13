"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Check, Loader2Icon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBDCMeta } from "@/app/redux/slices/bdcMetaSlice";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import BDCData from "@/app/assets/data/BDC_data.json";
import { fetch_financial_statement } from "@/app/services/api/fetch_financial_statements";

interface Props {
  setStatementsLoading: (loading: boolean) => void;
  statements_loading: boolean;
  setFilingData: (data: {
    accessionNumber: string;
    primaryDocument: string;
  }) => void;
  setGroupedReports: (data: Record<string, any[]> | null) => void;
}

const BDC_LIST = BDCData.Data.map((bdc) => ({
  ...bdc,
  label: bdc.label.trim(),
}));

const FormSchema = z.object({
  selected_bdc: z.object({
    value: z.number(),
    CIK: z.string(),
    ticker: z.string(),
    label: z.string(),
  }),
  selected_form: z.string().min(1, "Select a filing type"),
  selected_date: z.string().min(1, "Select a reporting date"),
});

export default function FetchFinancialStatementsForm({
  setFilingData,
  setStatementsLoading,
  statements_loading,
  setGroupedReports,
}: Props) {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.bdcMeta);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selected_bdc: {
        value: 0,
        CIK: "",
        ticker: "",
        label: "",
      },
      selected_form: "",
      selected_date: "",
    },
  });

  const selectedForm = form.watch("selected_form");

  // ===== Filings Parsing =====
  const filings = useMemo(() => {
    try {
      return data?.recent_filings_array
        ? JSON.parse(data.recent_filings_array)
        : [];
    } catch {
      return [];
    }
  }, [data]);

  const filteredFilings = useMemo(
    () =>
      filings.filter(
        (f: any) => f.form === "10-K" || f.form === "10-Q" || f.form === "N-CSR"
      ),
    [filings]
  );

  const formOptions = useMemo<string[]>(
    () => Array.from(new Set(filteredFilings.map((f: any) => String(f.form)))),
    [filteredFilings]
  );

  const dateOptions = useMemo(
    () =>
      filteredFilings
        .filter((f: any) => f.form === selectedForm)
        .map((f: any) => f.reportDate),
    [filteredFilings, selectedForm]
  );

  // ===== Fetch BDC Metadata =====
  const handleBDCSelect = async (bdc: any) => {
    form.setValue("selected_bdc", bdc);
    form.setValue("selected_form", "");
    form.setValue("selected_date", "");
    setOpen(false);

    try {
      await dispatch(fetchBDCMeta(bdc.CIK)).unwrap();
      toast.success("Filings fetched successfully!");
    } catch {
      toast.error("Failed to fetch filings.");
    }
  };

  // ===== Submit Handler =====
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setStatementsLoading(true);
    setGroupedReports(null);

    const match = filteredFilings.find(
      (f: any) =>
        f.form === values.selected_form && f.reportDate === values.selected_date
    );

    if (!match) {
      toast.error("Invalid filing selection");
      setStatementsLoading(false);
      return;
    }

    try {
      const cik = data?.cik || values.selected_bdc.CIK;
      const accession = match.accessionNumber?.replace(/-/g, "");

      // ✅ Construct SEC filing URL
      const secUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(
        cik
      )}/${accession}`;

      toast.message("Fetching financial statements...", {
        description: `${values.selected_bdc.ticker} | ${values.selected_form} | ${values.selected_date}`,
      });

      // ✅ Fetch the data
      const result = await fetch_financial_statement(secUrl);

      if (result && result.groupedReports) {
        setGroupedReports(result.groupedReports);
        toast.success("Financial statements loaded successfully!");
      } else {
        setGroupedReports(null);
        toast.error("No groupedReports found in response.");
      }

      // ✅ Pass to parent
      setFilingData({
        accessionNumber: match.accessionNumber,
        primaryDocument: match.primaryDocument,
      });
    } catch (error: any) {
      console.error("Error fetching financial statements:", error);
      toast.error(`Error fetching statements: ${error.message}`);
      setGroupedReports(null);
    } finally {
      setStatementsLoading(false);
    }
  };

  // ===== Filter BDCs =====
  const filteredBDCs = BDC_LIST.filter((bdc) => {
    const queryWords = search.toLowerCase().split(/\s+/).filter(Boolean);
    const searchable = `${bdc.ticker} ${bdc.label} ${bdc.CIK}`.toLowerCase();
    return queryWords.every((word) => searchable.includes(word));
  });

  // ===== UI =====
  return (
    <>
      {/* Show BDC name from global state */}
      {data?.name && (
        <p className="text-base font-medium mb-2 text-[#435f97]">
          {data.name}
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* ===== BDC Selector ===== */}
          <FormField
            control={form.control}
            name="selected_bdc"
            render={({ field }) => (
              <FormItem className="flex-[2] min-w-[280px]">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value?.label || "Select BDC"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search BDC..."
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandEmpty>No BDC found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {filteredBDCs.map((bdc) => (
                          <CommandItem
                            key={bdc.CIK}
                            value={bdc.label}
                            onSelect={() => handleBDCSelect(bdc)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                bdc.CIK === field.value?.CIK
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {bdc.ticker} – {bdc.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===== Filing Type ===== */}
          <FormField
            control={form.control}
            name="selected_form"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[160px]">
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("selected_date", "");
                    }}
                    disabled={!filteredFilings.length}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filing Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.map((formType) => (
                        <SelectItem key={formType} value={formType}>
                          {formType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===== Filing Date ===== */}
          <FormField
            control={form.control}
            name="selected_date"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-[160px]">
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!form.watch("selected_form")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Reporting Date" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((date: string) => (
                        <SelectItem key={date} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ===== Submit Button ===== */}
          <div className="flex-1 min-w-[140px]">
            {statements_loading ? (
              <Button size="sm" disabled className="w-full">
                <Loader2Icon className="animate-spin mr-2" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#435f97] text-white">
                Submit
              </Button>
            )}
          </div>

          {/* ===== Redux Loader ===== */}
          {status === "loading" && (
            <Loader2 className="animate-spin text-muted-foreground ml-2" />
          )}
        </form>
      </Form>
    </>
  );
}
