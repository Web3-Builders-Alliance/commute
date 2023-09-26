import { CloseAcsessPDA } from "@/components/ClosePDA";
import Link from "next/link";

const getUserDetailsByPubkey = async (id: any) => {
  try {
    const res = await fetch(`http://localhost:3000/api/user-details/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user details");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function UserDetails({ params }: any) {
  const { id } = params;
  console.log(id);
  const { sellerProgram, accessPDA } = await getUserDetailsByPubkey(id);

  return (
    <>
      <section className="w-full max-w-full flex-start flex-col ml-16 mr-16 mb-10">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Seller programs</span>
        </h1>
        <p className="desc text-left max-w-md">
          The programs which you listed in marketplace.
        </p>
      </section>
      <div>
        {sellerProgram?.map((eachSellerProgram: any, index: number) => {
          return (
            <div key={eachSellerProgram._id} className="display_program_card flex flex-col gap-5 m-4 justify-between items-start"> 
                <div>
                  <div className="flex justify-between">
                    <h2 className="font-satoshi font-semibold">
                      Program name :
                      <span className="font-semibold blue_gradient">
                        {` `}
                        {eachSellerProgram.program_name}
                      </span>
                    </h2>
                    <p className="font-satoshi font-semibold">
                      Amount :
                      <span className="font-semibold blue_gradient">
                        {` `}
                        {eachSellerProgram.amount} SOL
                      </span>
                    </p>
                  </div>
                  <p className="my-4 font-satoshi">
                    <strong>program id : </strong>
                    <span className="text-l text-gray-700">
                      {` `}
                      {eachSellerProgram.program_id}
                    </span>
                  </p>
                  <p className="my-4 font-satoshi">
                    <strong>seller program pda : </strong>
                    <span className="text-l text-gray-700">
                      {` `}
                      {eachSellerProgram.seller_program_pda}
                    </span>
                  </p>
                  <p className="my-4 font-satoshi">
                    <strong>seller pubkey : </strong>
                    <span className="text-l text-gray-700">
                      {` `}
                      {eachSellerProgram.seller_pubkey}
                    </span>
                  </p>
                  <p className="my-4 font-satoshi text-l">
                    <strong>description :</strong>
                    <span className="text-l text-gray-700">
                      {` `}
                      {eachSellerProgram.program_description}
                    </span>
                  </p>
                </div>
              </div>
            
          );
        })}
      </div>
    
      <hr className="flex-grow" />
      
      <section className="w-full max-w-full flex-start flex-col ml-16 mr-16 mb-10">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Access PDA</span>
        </h1>
        <p className="desc text-left max-w-md">
          You have access to these programs
        </p>
      </section>
      <div>
        {accessPDA?.map((eachAccessPDA: any, index: number) => {
          return (

            <div key={eachAccessPDA._id} className="display_program_card flex flex-col gap-5 m-4 justify-between items-start"> 
            <div>
              <div className="flex justify-between">
                <h2 className="font-satoshi font-semibold">
                  Program name :
                  <span className="font-semibold blue_gradient">
                    {` `}
                    {eachAccessPDA.program_name}
                  </span>
                </h2>
                <p className="font-satoshi font-semibold">
                  Amount :
                  <span className="font-semibold blue_gradient">
                    {` `}
                    {eachAccessPDA.amount} SOL
                  </span>
                </p>
              </div>
              <p className="my-4 font-satoshi">
                <strong>program id : </strong>
                <span className="text-l text-gray-700">
                  {` `}
                  {eachAccessPDA.program_id}
                </span>
              </p>
              <p className="my-4 font-satoshi">
                <strong>seller program pda : </strong>
                <span className="text-l text-gray-700">
                  {` `}
                  {eachAccessPDA.seller_program_pda}
                </span>
              </p>
              <p className="my-4 font-satoshi">
                <strong>seller pubkey : </strong>
                <span className="text-l text-gray-700">
                  {` `}
                  {eachAccessPDA.seller_pubkey}
                </span>
              </p>
              <p className="my-4 font-satoshi text-l">
                <strong>description :</strong>
                <span className="text-l text-gray-700">
                  {` `}
                  {eachAccessPDA.program_description}
                </span>
              </p>
            </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
