const contractAddress = "0xDf71c46C3ed8be73bF54c37138e7be76657b16C6";

let provider;
let signer;
let contract;

const abi = [
  {
    "inputs":[
      {"internalType":"address","name":"_citizen","type":"address"},
      {"internalType":"uint256","name":"_amount","type":"uint256"}
    ],
    "name":"awardPoints",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[
      {"internalType":"address","name":"_citizen","type":"address"},
      {"internalType":"uint256","name":"_amount","type":"uint256"}
    ],
    "name":"redeemPoints",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"checkMyBalance",
    "outputs":[
      {"internalType":"uint256","name":"","type":"uint256"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"admin",
    "outputs":[
      {"internalType":"address","name":"","type":"address"}
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

// Conectar MetaMask
async function connectWallet(){
  if(!window.ethereum){
    alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    return;
  }

  try {
    await window.ethereum.request({
      method:"eth_requestAccounts"
    });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    const address = await signer.getAddress();
    document.getElementById("wallet").innerText = address;

    // Cargar el saldo inmediatamente al conectar de forma automática
    loadBalance();
  } catch (error) {
    console.error(error);
    alert("Error al conectar con MetaMask.");
  }
}

// Consultar Saldo
async function loadBalance(){
  if(!contract){
    alert("Primero conecta MetaMask haciendo clic en 'Conectar MetaMask'.");
    return;
  }

  try{
    const balance = await contract.checkMyBalance();
    document.getElementById("balance").innerText = balance.toString();
  }catch(error){
    console.error(error);
    alert("No fue posible consultar el saldo.");
  }
}

// Asignar Puntos (Solo Administrador)
async function awardPoints(){
  if(!contract){
    alert("Primero conecta MetaMask haciendo clic en 'Conectar MetaMask'.");
    return;
  }

  const citizen = document.getElementById("awardAddress").value;
  const amount = document.getElementById("awardAmount").value;

  if(citizen === "" || amount === ""){
    alert("Completa todos los campos.");
    return;
  }

  try{
    const tx = await contract.awardPoints(citizen, amount);

    alert("Transacción enviada. Esperando confirmación en la red...");
    await tx.wait();

    alert("✅ EcoPoints asignados correctamente.");
    loadBalance();
  }catch(error){
    console.error(error);
    alert("No fue posible asignar EcoPoints. Recuerda que solo el administrador puede hacerlo.");
  }
}

// Canjear Puntos
async function redeemPoints(){
  if(!contract){
    alert("Primero conecta MetaMask haciendo clic en 'Conectar MetaMask'.");
    return;
  }

  const citizen = document.getElementById("redeemAddress").value;
  const amount = document.getElementById("redeemAmount").value;

  if(citizen === "" || amount === ""){
    alert("Completa todos los campos.");
    return;
  }

  try{
    const tx = await contract.redeemPoints(citizen, amount);

    alert("Transacción enviada. Esperando confirmación en la red...");
    await tx.wait();

    alert("✅ EcoPoints canjeados correctamente.");
    loadBalance();
  }catch(error){
    console.error(error);
    alert("No fue posible canjear EcoPoints.");
  }
}

// Event Listeners (Vincular botones con funciones)
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("balanceButton").addEventListener("click", loadBalance);
document.getElementById("awardButton").addEventListener("click", awardPoints);
document.getElementById("redeemButton").addEventListener("click", redeemPoints);
