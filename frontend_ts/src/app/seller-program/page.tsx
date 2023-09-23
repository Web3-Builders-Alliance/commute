import Link from "next/link";


const getSellerPrograms = async () => {
    try {
        const res = await fetch(`http://localhost:3000/api/seller-program`, {cache:"no-store"});
        if (!res.ok) {
            throw new Error("Failed to fetch seller");
        }
        return res.json(); 

    } catch (error) {
        console.log(error);
    }
}

export default async function sellerProgramList() {
    const {sellerPrograms} = await getSellerPrograms();
    // console.log(sellerPrograms);
    return (
        <div>
            {
                sellerPrograms?.map((sellerProgram : any, index : number)=> {
                    return(
                    <div
                    key={sellerProgram._id}
                    className="p-4 border border-black my-3 flex justify-between gap-5 items-start"
                  >
                    <div>
                        <div>
                            <h2 className="font-bold text-2xl">program name:{sellerProgram.program_name}</h2>
                            <h2>amount : {sellerProgram.amount}</h2>
                        </div>
                        <div>seller pubkey : {sellerProgram.seller_pubkey}</div>
                      <div>{sellerProgram.program_description}</div>
                    </div>
          
                    <div className="flex gap-2">
                      <Link href={`/seller-program/${sellerProgram._id}`}>
                        buy access pda
                      </Link>
                    </div>
                  </div>
                    )                
                }) 
            }
        </div>
    )
}