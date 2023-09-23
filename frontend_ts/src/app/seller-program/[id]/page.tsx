
import { CreateAccessPDA } from "@/components/CreateAccessPDA";

const getSellerProgramById = async (id:any) => {
    try {
        const res = await fetch(`http://localhost:3000/api/seller-program/${id}`, {cache:"no-store"});
        if (!res.ok) {
            throw new Error("Failed to fetch seller");
        }
        return res.json(); 

    } catch (error) {
        console.log(error);
    }
}

export default async function BuySellerProgram({params}:any) {
    const {id} = params;
    console.log(id);
    const {sellerProgram} = await getSellerProgramById(id);
    const {program_name, program_description, program_id, seller_pubkey, seller_program_pda, amount} = sellerProgram;

    return (
        <div>
            <div className="border border-black m-2 p-4">
                <div className="flex justify-between">
                    <h2>program name : {program_name}</h2>
                    <h2>amount : {amount}</h2>
                </div>
                <p>program id : {program_id}</p>
                <br></br>
                <p>description : {program_description}</p>

                <CreateAccessPDA sellerProgramIdStr={seller_program_pda} sellerPubkey={seller_pubkey} programId={program_id} programDescripton={program_description} amountInSol={amount} programName={program_name}/>

            </div>
        </div>
            

        
    )
    
}