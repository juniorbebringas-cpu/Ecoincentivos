// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EcoPoint {
    // Dirección del administrador (el Centro de Reciclaje autorizado)
    address public admin;

    // Registro de saldos: asocia la billetera de un ciudadano con sus EcoPuntos
    mapping(address => uint256) public ecoBalances;

    // Eventos para dejar un "recibo" público en la blockchain
    event PointsAwarded(address indexed citizen, uint256 amount);
    event PointsRedeemed(address indexed citizen, uint256 amount);

    // Al crear el contrato, quien lo publica se convierte automáticamente en el administrador
    constructor() {
        admin = msg.sender;
    }

    // Medida de seguridad: solo el administrador puede dar o quitar puntos
    modifier onlyAdmin() {
        require(msg.sender == admin, "Solo el centro de reciclaje puede hacer esto");
        _;
    }

    // Función 1: Dar puntos a un ciudadano cuando entrega reciclaje
    function awardPoints(address _citizen, uint256 _amount) public onlyAdmin {
        ecoBalances[_citizen] += _amount;
        emit PointsAwarded(_citizen, _amount);
    }

    // Función 2: Descontar puntos cuando el ciudadano los canjea por un beneficio
    function redeemPoints(address _citizen, uint256 _amount) public onlyAdmin {
        require(ecoBalances[_citizen] >= _amount, "Saldo de EcoPuntos insuficiente");
        ecoBalances[_citizen] -= _amount;
        emit PointsRedeemed(_citizen, _amount);
    }

    // Función 3: Permite a cualquier persona consultar cuántos puntos tiene en su cuenta
    function checkMyBalance() public view returns (uint256) {
        return ecoBalances[msg.sender];
    }
}
