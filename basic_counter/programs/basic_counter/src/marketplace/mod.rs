use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeSellerProgram<'info> {
    #[account(mut)]
    seller:Signer<'info>,
    #[account(
        init,
        payer = seller,
        space = 8 + 32*2,
        seeds=[b"seller"],
        bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct InitializeAccessPda<'info> {
    #[account(mut)]
    buyer:Signer<'info>,
    #[account(
        seeds=[b"seller"],
        bump,
    )]
    seller_program: Account<'info, SellerProgram>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 32*2,
        seeds = [b"access"],
        bump

    )]
    access_pda: Account<'info, AccessPda>,
    system_program : Program<'info, System>
}

impl <'info> InitializeAccessPda <'info> {
    pub fn initialize_access_pda(&mut self) -> Result<()> {
        self.access_pda.buyer = self.buyer.key();
        self.access_pda.program_id = self.seller_program.program_id;
        Ok(())
    }
}
impl <'info> InitializeSellerProgram <'info> {
    pub fn initialize_seller_program(&mut self, program_id : Pubkey) -> Result<()> {
        self.seller_program.program_id = program_id;
        self.seller_program.seller = self.seller.key();
        Ok(())
    }
}

#[account]
pub struct AccessPda {
    pub program_id : Pubkey,
    pub buyer:Pubkey
}

#[account]
pub struct SellerProgram {
    pub program_id:Pubkey,
    pub seller:Pubkey,
}