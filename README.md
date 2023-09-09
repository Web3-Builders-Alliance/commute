# commute
# marketplace for program

## description
this marketplace makes use of solana blockchain and lets users buy and sell program rights
to put it simply ONDC for solana programs

## basic user jouney
### seller:
go to marketplace 
1. connect your wallet
2. upload your program on the platform by adding a new project in your account
3. now fill the required details like programID, IDL of your code, github link, amount, and a short description so we can list it and its features on platform.
### buyer:
go to the marketplace 
1. connect your wallet and find program that you want using our search bar and filter catogories 
2. once found, click buy to make a transaction to the seller of amount given.
3. if transaction = sucess
    1) create a pda owned by our marketplace program which has his pubkey, and his usage limitation
    2) to use program, we will need the seller to add a access pda has acoounts for intialise fn.
    3) so the account relevant for the program is only created if buyer calls intialise
this can also be done by creating a macro for pubkey and signer check
and adding it in front of each function

## Marketplace Architecture
![Program Marketplace](https://github.com/ShrinathNR/wba_capstone_notes/assets/116967403/911826ac-d0c5-4438-8d9f-bab5bd16c54b)


## benifits
1. being able to make money out of your programs
2. recognition and stage in an on chain by platoform (like app store)

fund flow:              funds released 
                        periodic
buyer -----> buffer acc -----------> seller
                        sits there 
## tech stack
- db = sql / mongodb(prefered)
- frontend = nextjs
- backend = nodejs & solana
