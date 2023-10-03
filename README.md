# commute
a marketplace or an infrastructure to monetize solana programs. focussing on both buyers and sellers is crucial to create a fair market. so this uses PDA and not spl-token(which is the norm in marketplace). this is intentional. this avoids trading program access which affects the sellers in the market. and buyers are protected by provided a trial period with a minimal cost when they can test the functionality and usefullness for thier application. 

## create seller program
-  open a pda account with program id, seller pubkey as seeds with before mentioned details with amount stored in the struct. 

## create access pda
- since transations are atomic in nature in solana, we can utilise it by including both the instruction in a single transaction
- and the two instructions are 
    1. transfer amount which depends on trial or permanent access
    2. create access pda
- open a access pda is done by feeding buyer pubkey, program id into the seeds and a acc struct with all the details mentioned before with amount and expiry is created


## user story
### seller flow:
*In IDE*
 1. add the macro provided by the commute market place in the acc intialization in your solana program
 2. upload ur program to the solana block chain  

 *In Commute*

 3. login in to commute with your wallet and create a seller program with program name, description, amount and program id
 4.  and voila seller program is created in commute marketplace ready to be bought.

 ### buyer flow:

 *In Commute*
 1. login to commute with ur wallet
 2. visit the seller program list and look for the solana program which best suites ur needs
 3. click to see the complete info of the seller program, if needed can verify everything in block explorer with the seller program pda
 4. once satisfied, choose trial or permanent access.
 5. go ahead buy the access pda. which will intiate a sol transfer to the seller pubkey and also create the access pda

*In IDE*

6. to access the methods provided buy the seller program, we need to pass the access pda while invoking the functions.
7. which does the relavent checks and validates the buyer

## User Story Flow chart 
![Program Marketplace](https://i.imgur.com/o9My2el.jpg)
