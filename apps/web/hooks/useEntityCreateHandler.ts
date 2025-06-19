import { useAccounts } from "@/hooks/useAccounts";
import { useHeaders } from "@/hooks/useHeaders";
import { useTags } from "@/hooks/useTags";
import { useSourceDestinations } from "@/hooks/useSourceDestinatio";
import { CreateAccountInput, CreateHeaderInput, CreateSourceDestinationInput, CreateTagInput } from "@cashbook/utils";

export function useEntityCreateHandlers() {
  const { createAccount } = useAccounts();
  const { createHeader } = useHeaders();
  const { createTag } = useTags();
  const { createSourceDestination } = useSourceDestinations();

  const handleCreateAccount = async (
    data: CreateAccountInput,
    onClose: () => void
  ) => {
    try {
      await createAccount.mutateAsync({ data });
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const handleCreateHeader = async (
    data: CreateHeaderInput,
    onClose: () => void
  ) => {
    try {
      await createHeader.mutateAsync({ data });
      onClose();
    } catch (error) {
      console.error("Error creating header:", error);
    }
  };

  const handleCreateTag = async (
    data: CreateTagInput,
    onClose: () => void
  ) => {
    try {
      await createTag.mutateAsync({ data });
      onClose();
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleCreateSourceDestination = async (
    data: CreateSourceDestinationInput,
    onClose: () => void
  ) => {
    try {
      await createSourceDestination.mutateAsync({ data });
      onClose();
    } catch (error) {
      console.error("Error creating source destination:", error);
    }
  };

  return {
    handleCreateAccount,
    handleCreateHeader,
    handleCreateTag,
    handleCreateSourceDestination,
  };
}
