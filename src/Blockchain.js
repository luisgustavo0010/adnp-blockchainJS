import SHA256 from 'crypto-js/sha256.js';
import format from 'crypto-js';


const inicio = new Date().getTime() //Inicio tempo de exec

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
// Cria uma classe Block com um construtor para os dados dentro do bloco
class Block{ 
    
    constructor(index, timestamp, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
    //  this.transactions = transactions;
        this.previousHash = previousHash
        this.hash = this.calculateHash();
        this.nonce = 0; // atraves do processo de mineração, não posso alterar os dados
                        // visto que possa ser uma transação, por isso a variavel Nonce
    }




    //Calcula o Hash a partir dos dados do bloco
    calculateHash(){
        return SHA256(this.index + 
                      this.previousHash + 
                      this.timestamp + 
                      JSON.stringify(this.data) +
                      this.nonce).toString();
    }

    // Processo de mineração, inserção de 0 ao inicio
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: " + this.hash);
        console.log("Block Mined Previous: " + this.previousHash);
    }
}

// Faz a junção como uma corrente dos blocos
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 5; // Quantidade de zeros adicionado
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    // Cria o primeiro bloco, esse o Hash é 0 pois não tem anterior para apontar
    createGenesisBlock(){
        return new Block("30/08/2020", "Genesis block", "0");
    }

    // Retorna o ultimo bloco da cadeia
    getLatestBLock(){
        return this.chain[this.chain.length - 1];
    }

    // // Adiciona um novo bloco, chamando a hash do 
    // // bloco anterior e calcula novamente o hash caso haja alguma alteração,
    // // adicionando ele na cadeia novamente
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBLock().hash;
    //    newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);

    }

    // // Cria uma transação e a deixa pendente refereindo-se ao endereço e valor trasnferido
    // minePendingTransactions(miningRewardAddress){
    //     let block = new Block(Date.now(),this.pendingTransactions);
    //     block.mineBlock(this.difficulty);
    //     this.chain.push(block);

    //     this.pendingTransactions = [
    //         new Transaction(null, miningRewardAddress, this.miningReward)
    //     ];
        
    // }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    // Realiza a transação entre os endereços, tirando o saldo de um e adicionando ao outro
    getBalanceofAddres(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address)
                    balance -= trans.amount;
                if(trans.toAddress === address)
                    balance += trans.amount;
            }
        }
    }


    // Verifica a integridade da cadeia de blocos, retornando verdadeiro ou falso
    // caso o bloco aponte para o anterior
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i -1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash == previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}



let teste = new Blockchain(); 


console.log('Blockchain é valido?' + teste.isChainValid())

console.log('Mining Block 1');
teste.addBlock(new Block(1, "20/08/2020", { amount: 10}));
console.log('Mining Block 2');
teste.addBlock(new Block(2, "10/08/2020", { amount: 8}));
console.log('Mining Block 3');
teste.addBlock(new Block(3, "05/10/2020", { amount: 7}));
console.log('Mining Block 4');
teste.addBlock(new Block(4, "08/11/2020", { amount: 2}));
console.log('Mining Block 5');
teste.addBlock(new Block(5, "22/08/2020", { amount: 1}));
console.log('Mining Block 6');
teste.addBlock(new Block(6, "20/08/2020", { amount: 4}));
console.log('Mining Block 7');
teste.addBlock(new Block(7, "20/08/2020", { amount: 9}));
console.log('Mining Block 8');
teste.addBlock(new Block(8, "20/08/2020", { amount: 4}));
console.log('Mining Block 9');
teste.addBlock(new Block(9, "20/08/2020", { amount: 5}));
console.log('Mining Block 10');
teste.addBlock(new Block(10, "20/08/2020", { amount: 3}));

const total = new Date().getTime() - inicio
console.log("Foi executado em: ", total + "ms") //Final tempo de exec