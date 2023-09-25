import { CloseAcsessPDA } from "@/components/ClosePDA";
import Link from "next/link";


const getUserDetailsByPubkey = async (id:any) => {
    try {
        const res = await fetch(`http://localhost:3000/api/user-details/${id}`, {cache:"no-store"});
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
    const {userDetails} = await getUserDetailsByPubkey(id);
    const {sellerProgram, accessPDA} = userDetails;

    return (
        <div>
            <div>
                <h1>Seller programs</h1>
                {
                    sellerProgram?.map((eachSellerProgram : any, index : number)=> {
                        return(
                        <div
                        key={eachSellerProgram._id}
                        className="p-4 border border-black my-3 flex justify-between gap-5 items-start"
                    >
                        <div>
                            <div>
                                <h2 className="font-bold text-2xl">program name:{eachSellerProgram.program_name}</h2>
                                <h2>amount : {eachSellerProgram.amount}</h2>
                            </div>
                            <div>seller pubkey : {eachSellerProgram.seller_pubkey}</div>
                            <div>program id : {eachSellerProgram.program_id}</div>
                        <div>seller program pda : {eachSellerProgram.seller_program_pda}</div>
                        <div>{eachSellerProgram.program_description}</div>

                        </div>
                    </div>
                        )                
                    }) 
                }
            </div>

            <div>
                <h1>Access PDA</h1>
                {
                    accessPDA?.map((eachAccessPDA : any, index : number)=> {
                        return(
                        <div
                        key={eachAccessPDA._id}
                        className="p-4 border border-black my-3 flex justify-between gap-5 items-start"
                    >
                        <div>
                            <div>
                                <h2 className="font-bold text-2xl">program name:{eachAccessPDA.program_name}</h2>
                                <h2>amount : {eachAccessPDA.amount}</h2>
                            </div>
                            <div>seller pubkey : {eachAccessPDA.seller_pubkey}</div>
                        <div>program id : {eachAccessPDA.program_id}</div>
                        <div>access pda : {eachAccessPDA.accessPDA}</div>

                        </div>
            
                        <div className="flex gap-2">
                            <CloseAcsessPDA programId={eachAccessPDA.program_id}/>
                        </div>
                    </div>
                        )                
                    }) 
                }
            </div>
            
            
        </div>
            

        
    )
    
}