const getSellerProgramById = async (id:any) => {
    try {
        const res = await fetch(`https://localhost:3000/api/seller-program/${id}`, {cache:"no-store"});
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
    console.log(sellerProgram);
    const {program_name, program_description, program_id, seller_program_pda, amount} = sellerProgram;

    return (
        <div>

            <div className=" border-black">
            <div className="flex justify-between">
                <h2>{program_name}</h2>
                <h2>{amount}</h2>
            </div>
            <p>{program_id}</p>
            <br></br>
            <p>{program_description}</p>
            {/* <button  disabled = {!publicKey}>
                buy access pda
            </button> */}

        </div>
        </div>
        
    )
    
}