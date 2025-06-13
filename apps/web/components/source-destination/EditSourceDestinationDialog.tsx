"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type UpdateSourceDestinationInput } from "@cashbook/validation";
import { updateAccountSchema } from "@cashbook/validation";
import { SourceDestination } from "@cashbook/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";

interface EditSourceDestinationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: SourceDestination;
  onSubmit: (data: UpdateSourceDestinationInput) => void;
}

export function EditSourceDestinationDialog({
  open,
  onOpenChange,
  entity,
  onSubmit,
}: EditSourceDestinationDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateSourceDestinationInput>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: entity.name,
      gst: entity.gst,
      pan: entity.pan,
      address: entity.address,
      state: entity.state,
      pin: entity.pin,
      country: entity.country,
      nationalId: entity.nationalId,
      details: entity.details,
    },
  });

  const handleFormSubmit = async (data: UpdateSourceDestinationInput) => {
    try {
      await onSubmit(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating entity:", error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-0 shadow-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out">
          <div className="flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 pt-6">
              <Dialog.Title className="text-2xl font-bold">
                Edit Entity
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-gray-600">
                Update your entity information below
              </Dialog.Description>
            </div>

            <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
              <form
                id="edit-entity-form"
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <Input
                  label="Entity Name"
                  type="text"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Input
                  label="GST Number"
                  type="text"
                  {...register("gst")}
                  error={errors.gst?.message}
                />

                <Input
                  label="PAN"
                  type="text"
                  {...register("pan")}
                  error={errors.pan?.message}
                />

                <Input
                  label="Address"
                  type="text"
                  {...register("address")}
                  error={errors.address?.message}
                />

                <Input
                  label="State"
                  type="text"
                  {...register("state")}
                  error={errors.state?.message}
                />

                <Input
                  label="PIN"
                  type="text"
                  {...register("pin")}
                  error={errors.pin?.message}
                />

                <Input
                  label="Country"
                  type="text"
                  {...register("country")}
                  error={errors.country?.message}
                />

                <Input
                  label="AADHAR Number"
                  type="text"
                  {...register("nationalId")}
                  error={errors.nationalId?.message}
                />

                <Input
                  label="Details"
                  type="text"
                  {...register("details")}
                  error={errors.details?.message}
                />
              </form>

              {/* Footer */}
              <div className="mt-auto flex justify-end gap-3 border-t px-6 py-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="edit-entity-form"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
            <Cross2Icon className="h-5 w-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
