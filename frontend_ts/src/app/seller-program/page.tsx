import Link from "next/link";

const getSellerPrograms = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/seller-program`, {
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

export default async function sellerProgramList() {
  const { sellerPrograms } = await getSellerPrograms();
  // console.log(sellerPrograms);
  return (
    <>
      <section className="w-full max-w-full flex-start flex-col ml-32 mr-32 mb-10">
        <h1 className="head_text text-left">
          <span className="blue_gradient">Program Marketplace</span>
        </h1>
        <p className="desc text-left max-w-md">
          Purchase the program you want, then get access to the program and
          start interacting with program.
        </p>
      </section>
      <section className="ml-32 mr-32 mb-10">
        <div className="gap-4 overflow-scroll mt-16 program_layout">
          {sellerPrograms?.map((sellerProgram: any) => {
            return (
              <div key={sellerProgram._id} className="program_card">
                <div className="">
                  <div>
                    <h2 className="font-satoshi font-bold blue_gradient">
                      program name : {sellerProgram.program_name}
                    </h2>
                    <h2 className="font-inter text-sm text-gray-500">
                      amount : {sellerProgram.amount} SOL
                    </h2>
                  </div>

                  <div className="my-4 font-satoshi text-sm text-gray-700">
                    discription : {sellerProgram.program_description}
                  </div>

                  <div className="access_btn orange_gradient">
                    <Link href={`/seller-program/${sellerProgram._id}`}>
                      get access
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// // flex-1 flex justify-start items-center gap-3 cursor-pointer
