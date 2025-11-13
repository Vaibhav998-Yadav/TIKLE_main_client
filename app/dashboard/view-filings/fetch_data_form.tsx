"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import BDCData from "@/app/assets/data/BDC_data.json";

interface BDCItem {
  value: number;
  CIK: string;
  ticker: string;
  label: string;
}

const BDC_LIST: BDCItem[] = BDCData.Data.map((bdc) => ({
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
});

export function Fetch_data_form() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.bdcMeta);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selected_bdc: {
        value: 0,
        CIK: "",
        ticker: "",
        label: "",
      },
    },
  });

  const filteredBDCs = BDC_LIST.filter((bdc) => {
    const queryWords = search.toLowerCase().split(/\s+/).filter(Boolean);
    const searchable = `${bdc.ticker} ${bdc.label} ${bdc.CIK}`.toLowerCase();
    return queryWords.every((word) => searchable.includes(word));
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const cik = data.selected_bdc.CIK;
    try {
      await dispatch(fetchBDCMeta(cik)).unwrap();
      toast.success("Filings fetched and stored in Redux!");
    } catch (error) {
      toast.error("Failed to fetch filings.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm items-center gap-2"
      >
        <FormField
          control={form.control}
          name="selected_bdc"
          render={({ field }) => (
            <FormItem className="w-full">
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
                      <span
                        className="block max-w-[160px] truncate"
                        title={field.value?.label}
                      >
                        {field.value?.label ? (
                          <span title={field.value.label}>
                            {field.value.label.length > 30
                              ? field.value.label.slice(0, 27) + "..."
                              : field.value.label}
                          </span>
                        ) : (
                          "Select BDC name"
                        )}
                      </span>
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
                          value={`${bdc.label}`}
                          onSelect={() => {
                            form.setValue("selected_bdc", bdc);
                            setOpen(false);
                          }}
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
        {status === "loading" ? (
          <Button size="sm" disabled>
            <Loader2Icon className="animate-spin" />
            Getting Data
          </Button>
        ) : (
          <Button type="submit" className="bg-[#000082] text-white">
            Fetch Data
          </Button>
        )}
      </form>
    </Form>
  );
}
