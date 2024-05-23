const Usuario = require('../models/usuario');
const UsuariosTurmas = require('../models/Usuarios_turmas');

exports.getAll = async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios)
};

exports.getById = async (req, res) => {
    const idDoParam = req.params.id;
    const usuarioEncontrado = await  Usuario.findOne({idUsuarios: idDoParam});
    res.json(usuarioEncontrado)
};

exports.createUsuario = async (req, res) => {
    const usuarioCadastrado = await Usuario.findOne({ where: {cpf : req.body.cpf}});
    if (usuarioCadastrado) {
        return res.send('Já existe um usuário cadastrado neste CPF.')
    }
    const usuarioCriado = await Usuario.create(req.body);
    if (usuarioCriado.idUsuarios && req.body.Turmas_idTurmas){
        await UsuariosTurmas.create({
            Turmas_idTurmas: req.body.Turmas_idTurmas,
            Usuarios_idUsuarios: usuarioCriado.idUsuarios,
        })
    }
    console.log("usuarioCriado", usuarioCriado);
    return res.send("Usuário criado com sucesso");
};

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send("Usuário não encontrado");
        }

        const desvincular = await UsuariosTurmas.findOne({where: {Usuarios_idUsuarios: usuario.idUsuarios}});
        if (desvincular) {
            await desvincular.destroy();
        }
        await usuario.destroy();

        return res.send('Usuário deletado com sucesso');
    } catch (error) {
        console.error('Usuário deletado com sucesso');
        return res.status(500).send('Erro ao deletar usuário');
    }
    // const cpfUser = req.params.cpf;
    // const usuarioDeletado = await Usuario.findOne({ where: {cpf : cpfUser}});
    // if (usuarioDeletado) {
    //     const deleteUsuario = await Usuario.destroy({where: {cpf: cpfUser}})
    //     if (deleteUsuario) {
    //         return res.send('Usuário deletado com sucesso!')
    //     } else {
    //         return res.send('Erro ao deletar usuário');
    //     }
    // } else {
    //     return res.status(404).send('Não existe um usuário com este cpf');
    // }
}

exports.updateControllerNome = async (req, res) => {
    const cpfUser = req.params.cpf;
    try{
        const userMudar = await Usuario.findOne({where: {cpf: cpfUser}})

        if(userMudar) {
            delete req.body.cpf,
            delete req.body.Tipos_Usuarios_idTipos_Usuarios,
            delete req.body.idUsuarios;

            const [numRowsUpdate] = await Usuario.update(req.body, {
                where: {cpf: cpfUser}
            });

            if (numRowsUpdate > 0) {
                const usuarioMudado = await Usuario.findOne({where: {cpf: cpfUser}});
                return res.send({message: 'Usuário Atualizado com sucesso', usuarioatualizado: usuarioMudado});
            }
            else {
                return res.send('Usuário encontrado, porem, sem novos dados para atualizar');
            }
        }
        else{
            return res.status(404).send("Não existe um usuário cadastrado com este cpf");
        }
    } catch (error){
        consoler.error('Erro ao atualizar o usuário', error);
        return res.status(500).send('Ocorreu um erro ao atualizar o usuário.');
    }
};