# Commute
Twitter: https://twitter.com/commute_px  
Pitch deck : https://www.canva.com/design/DAFxFK7PCsk/6bOQPJkuyWf2sJ4DeQnr1g/edit?utm_content=DAFxFK7PCsk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
<br />
<br />
Simple, instant monetization for Solana programs with a Marketplace to attract users and promote community adoption. Focussing on both buyers and sellers is crucial to create a fair market. So this uses PDA - Program Derived Address and not SPL-token. This avoids trading program access which affects the sellers in the market. Buyers are protected by providing them a trial period with a minimal cost when they can test the functionality and usefullness for thier application. 

## Protocol architecture
![Program Marketplace](https://i.imgur.com/i3VvNnf.jpg)

## User story
### seller flow:
*In IDE*
 1. add the PDA access check provided by the commute market place in the acc intialization in your solana program
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
![Program Marketplace User Story](https://i.imgur.com/B79Ef9U.jpeg)
