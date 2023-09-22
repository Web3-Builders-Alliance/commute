
const getSellerProgramById = async (id:string) => {
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

