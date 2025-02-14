"use client"
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

function Topbar() {
    return (
        <nav className="topbar">
            {/* Wrap logo and text inside the Link component */}
            <Link href="/" className="flex items-center gap-4">
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>
            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex cursor-pointer">
                                <Image
                                  src="/assets/logout.svg"
                                  alt="logout"
                                  width={24}
                                  height={24}
                                >

                                </Image>

                            </div>
                        </SignOutButton>
                    </SignedIn>

                </div>
                <OrganizationSwitcher
                appearance={{
                    baseTheme: dark,
                    elements:
                    {
                        organizationSwitcherTrigger:"py-2 px-4"
                    }
                }}
                />
            </div>
        </nav>
    );
}

export default Topbar;
