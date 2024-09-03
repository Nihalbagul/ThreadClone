import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo.onboarded) {
    redirect("/onboarding");
    return null; // Add return statement after redirect
  }

  const thread = await fetchThreadById(params.id);
  if (!thread) return null; // Check if thread is null

  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || " "}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={params.id}
          currentUserImg={userInfo.image} // Assuming user.imageUrl is correct
          currentUserId={userInfo._id} // Removed JSON.stringify
        />
      </div>
      <div className="mt-10">
        {thread.children.map((childItem:any) =>
         <ThreadCard
         key={childItem._id}
         id={childItem._id}
         currentUserId={childItem?.id || " "}
         parentId={childItem.parentId}
         content={childItem.text}
         author={childItem.author}
         community={childItem.community}
         createdAt={childItem.createdAt}
         comments={childItem.children}
         isComment
        />
        )}
      </div>
    </section>
  );
};

export default Page;
