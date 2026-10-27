import { BsCalendarEvent } from 'react-icons/bs';
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosTime } from 'react-icons/io';
import { MdDateRange } from 'react-icons/md';


export default function CreateTicketPage() {
  return (
    <>
      <div className="-mx-3 -mt-3 overflow-hidden pb-4 md:-mx-5 md:-mt-5 h-100 bg-amber-400 p-5">
        <div>
          <div className='flex gap-2 items-center'>
            <BsCalendarEvent />
            <h1>Byon Combat S1</h1>
          </div>
          <div className='flex gap-2 items-center'>
            <FaLocationDot />
            <h1>Byon Combat S1</h1>
          </div>
          <div className='flex gap-2 items-center'>
            <BsCalendarEvent />
            <h1>Byon Combat S1</h1>
          </div>
          <div className='flex gap-2 items-center'>
            <BsCalendarEvent />
            <h1>Byon Combat S1</h1>
          </div>
        </div>
      </div>
      {/* <div className="w-full min-h-screen flex justify-center items-center">
        <div className="w-150 h-50 bg-amber-400"></div>
      </div> */}
    </>
  );
}
