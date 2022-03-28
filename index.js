const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
} = require("@solana/web3.js");

//STEP-1 Generating a new wallet keypair
const newPair = new Keypair();
console.log(newPair);

//We’re extracting the public key from accountInfo and storing it in a new variable called myPublicKey which is of type string.
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();

//We can do the same thing for a secret key
const secretKey = newPair._keypair.secretKey

//Web3.js allows us to view the balance using the getBalance method inside the connection class that we had imported
const getWalletBalance = async () => {
    try {
        //Creates a connection object that’ll be used to get the balance
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        
        //Next, we’ll create a wallet object from the secretKey
        const myWallet = await Keypair.fromSecretKey(secretKey);

        //We’ll now be querying the balance of this wallet
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        console.log(`Wallet balance: ${walletBalance}`);        
    } catch (err) {
        console.log(err);
    }
};

const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);

        console.log(`-- Airdropping 2 SOL --`)
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            5 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
        
    } catch (err) {
        console.log(err);
    }
};

const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();

}

driverFunction();