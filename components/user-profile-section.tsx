import { ChevronUp } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserProfileSection() {
  return (
    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-md mx-2 mb-2 flex items-center border border-white/30">
      <Avatar className="h-10 w-10 mr-3 border-2 border-white/50">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
        <AvatarFallback className="bg-white/20 text-gray-800">DT</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-800">Decipher Tech</h3>
        <p className="text-xs text-gray-600 truncate">developers@decipherfinancials.com</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-white/20 text-gray-700">
            <ChevronUp className="h-4 w-4" />
            <span className="sr-only">User menu</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
