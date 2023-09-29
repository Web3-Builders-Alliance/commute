import { CreateAccessPDA } from "@/components/CreateAccessPDA";

const getSellerProgramById = async (id: any) => {
  try {
    const res = await fetch(`http://localhost:3000/api/seller-program/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch seller");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function BuySellerProgram({ params }: any) {
  const { id } = params;
  const { sellerProgram } = await getSellerProgramById(id);
  const {
    program_name,
    program_description,
    program_id,
    seller_pubkey,
    seller_program_pda,
    amount,
  } = sellerProgram;

  return (
    <div className="display_program_card items-center mx-auto">
      <div>
        <div className="flex justify-between">
          <h2 className="font-satoshi font-semibold">
            Program name :
            <span className="font-semibold blue_gradient">
              {` `}
              {program_name}
            </span>
          </h2>
          <p className="font-satoshi font-semibold">
            Amount :
            <span className="font-semibold blue_gradient">
              {` `}
              {amount} SOL
            </span>
          </p>
        </div>
        <p className="my-4 font-satoshi">
          <strong>program id : </strong>
          <span className="text-l text-gray-700">
            {` `}
            {program_id}
          </span>
        </p>
        <p className="my-4 font-satoshi">
          <strong>seller program pda : </strong>
          <span className="text-l text-gray-700">
            {` `}
            {seller_program_pda}
          </span>
        </p>
        <p className="my-4 font-satoshi">
          <strong>seller pubkey : </strong>
          <span className="text-l text-gray-700">
            {` `}
            {seller_pubkey}
          </span>
        </p>
        <p className="my-4 font-satoshi text-l">
          <strong>description :</strong>
          <span className="text-l text-gray-700">
            {` `}
            {program_description}
          </span>
        </p>

        <CreateAccessPDA
          sellerProgramIdStr={seller_program_pda}
          sellerPubkey={seller_pubkey}
          programId={program_id}
          programDescripton={program_description}
          amountInSol={amount}
          programName={program_name}
        />
      </div>
    </div>
  );
}
