"use client";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

function Bottombar() {
 
    const pathname = usePathname();

    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const isActive =
                        (pathname.includes(link.route) && link.route.length > 1) ||
                        pathname === link.route;
                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`bottombar_link ${isActive ? "bg-primary-500" : ""}`}
                        >
                            {/* Wrap the Image and p tags inside the Link component */}
                            <div>
                                <Image
                                    src={link.imgURL}
                                    alt={link.label}
                                    width={24}
                                    height={24}
                                />
                                <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(/\s+/)[0]}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    )
}

export default Bottombar;
