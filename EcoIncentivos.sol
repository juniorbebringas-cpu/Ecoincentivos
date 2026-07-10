// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title EcoIncentivos - Sistema de recompensas por reciclaje
/// @notice Acuña EcoPoints a la billetera del ciudadano tras una acción de reciclaje verificada por un agente autorizado.
contract EcoIncentivos {
    address public owner;
    
    mapping(address => bool) public verificadores;
    mapping(address => uint256) public ecoPoints;

    uint256 public constant PUNTOS_POR_KG = 10;

    event AccionRegistrada(address indexed usuario, uint256 puntosOtorgados, uint256 timestamp);
    event VerificadorActualizado(address indexed verificador, bool estado);

    modifier soloOwner() {
        require(msg.sender == owner, "Acceso restringido al propietario");
        _;
    }

    modifier soloVerificador() {
        require(verificadores[msg.sender], "Acceso restringido a verificadores autorizados");
        _;
    }

    constructor() {
        owner = msg.sender;
        verificadores[msg.sender] = true; // El creador del contrato es el primer verificador
    }

    /// @notice Habilita o revoca a una direccion como verificador autorizado.
    function actualizarVerificador(address _verificador, bool _estado) external soloOwner {
        verificadores[_verificador] = _estado;
        emit VerificadorActualizado(_verificador, _estado);
    }

    /// @notice Registra una accion de reciclaje validada y acuna EcoPoints.
    function registrarReciclaje(address _usuario, uint256 _kilogramos) external soloVerificador {
        require(_usuario != address(0), "Direccion invalida");
        require(_kilogramos > 0, "La cantidad debe ser mayor a cero");

        uint256 puntos = _kilogramos * PUNTOS_POR_KG;
        ecoPoints[_usuario] += puntos;

        emit AccionRegistrada(_usuario, puntos, block.timestamp);
    }

    /// @notice Consulta el saldo de EcoPoints de una billetera.
    function consultarSaldo(address _usuario) external view returns (uint256) {
        return ecoPoints[_usuario];
    }
}
