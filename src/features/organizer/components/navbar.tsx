import Image from "next/image";

export default function DashboardNavbar() {
  return (
    <>
      <div className="navbar bg-white shadow-md sticky z-50 top-0">
        <div className="flex-1">
          <Image 
          src={'/lawang.svg'}
          alt="Lawang logo"
          width={100}
          height={100}
          />
        </div>
      </div>
    </>
  );
}
