"use client";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
      }
    );
  }, [workspaceId, memberId, mutate]);

  if (isPending)
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );

  if (!conversationId) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-y-2">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
