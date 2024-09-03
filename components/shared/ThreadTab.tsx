import { fetchUserPosts } from "@/lib/actions/thread.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadTab: React.FC<Props> = async ({ currentUserId, accountId, accountType }) => {
    // Fetch user posts
    let result: { threads: any[]; name: any; image: any; id: any; };
    try {
        result = await fetchUserPosts(accountId);
        if (!result) {
            redirect('/'); // Redirect to homepage if no result
            return null; // Return early
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return null; // Return early in case of error
    }

    // Render thread cards
    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads && Array.isArray(result.threads) && result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author === 'User' ? {name: result.name, image: result.image , id:result.id }:{name:thread.author.name,image:thread.author.image,id:thread.author.id}}

                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
};

export default ThreadTab;
