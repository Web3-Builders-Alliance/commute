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
            <div
              key={eachSellerProgram._id}
              className="display_program_card flex flex-col gap-5 m-4 justify-between items-start"
            >
              <div>
                <div>
                  <h2 className="font-bold text-xl">
                    program name : {eachSellerProgram.program_name}
                  </h2>
                  <h2>amount : {eachSellerProgram.amount}</h2>
                </div>
                <div>seller pubkey : {eachSellerProgram.seller_pubkey}</div>
                <div>program id : {eachSellerProgram.program_id}</div>
                <div>
                  seller program pda : {eachSellerProgram.seller_program_pda}
                </div>
                <div>discription : {eachSellerProgram.program_description}</div>
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
            <div
              key={eachAccessPDA._id}
              className="display_program_card flex flex-col gap-5 m-4 justify-between items-start"
            >
              <div>
                <div>
                  <h2 className="font-bold text-2xl">
                    program name : {eachAccessPDA.program_name}
                  </h2>
                  <h2>amount : {eachAccessPDA.amount}</h2>
                </div>
                <div>seller pubkey : {eachAccessPDA.seller_pubkey}</div>
                <div>program id : {eachAccessPDA.program_id}</div>
                <div>access pda : {eachAccessPDA.accessPDA}</div>
              </div>

              <div className="flex gap-2">
                <CloseAcsessPDA
                  programId={eachAccessPDA.program_id}
                  id={eachAccessPDA._id}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
