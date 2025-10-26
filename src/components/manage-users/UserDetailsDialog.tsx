"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { User } from "lucide-react";

interface UserDetailsDialogProps {
  user: IUser;
  onClose: () => void;
}

export default function UserDetailsDialog({ user, onClose }: UserDetailsDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                {user?.profileImage?.url ? (
                  <Image
                    src={user.profileImage.url}
                    alt={user.name || "User profile"}
                    fill
                    className="object-cover"
                    sizes="80px"
                    priority={false}
                    onError={(e) => {

                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    {user?.name ? (
                      <span className="text-2xl font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <User className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p>{new Date(user.createdAt as Date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Address</h3>
            {user.address ? (
              <div className="space-y-2">
                <p>{user.address.street}</p>
                <p>
                  {user.address.city}, {user.address.state} {user.address.postalCode}
                </p>
                <p>{user.address.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">No address provided</p>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}