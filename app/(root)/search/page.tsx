import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import PostThread from "@/components/forms/PostThread";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Thread from "@/lib/models/thread.model";
import ThreadTab from "@/components/shared/ThreadTab";
import { fetchUserPosts } from "@/lib/actions/thread.actions";
import UserCard from "@/components/cards/UserCard";

async function Page({params}:{params:{id:string}}) {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString:'',
    pagrNumber:1,
    pageSize:25,
  })
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      {}
      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ): (
          <>
          {
            result.users.map((person) => (
              <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl ={ person.image}
              personType ='User'
              />
            ))
          }
          </>
        )
        }
      </div>
    </section>
  )
}

export default Page
