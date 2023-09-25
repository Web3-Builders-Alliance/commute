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
                        <div>{eachSellerProgram.program_description}</div>
                        </div>
            
                        <div className="flex gap-2">
                        <Link href={`/seller-program/${eachSellerProgram._id}`}>
                            buy access pda
                        </Link>
                        </div>
                    </div>
                        )                
                    }) 
                }
            </div>

            <div>
                <h1>Access PDA</h1>
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
                        <div>{eachSellerProgram.program_description}</div>
                        </div>
            
                        <div className="flex gap-2">
                        <Link href={`/seller-program/${eachSellerProgram._id}`}>
                            buy access pda
                        </Link>
                        </div>
                    </div>
                        )                
                    }) 
                }
            </div>
            
            
        </div>
            

        
    )
    
}