use anchor_lang::prelude::*;

declare_id!("6PZWN3Vesc9G7PmgDxdZVby2UjJ4QABzf65yeEDKBrTA");

#[program]
pub mod data_license {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


