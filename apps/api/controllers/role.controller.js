const catchAsync = require('../util/catchAsync')
const RoleService =require('../services/RoleService')
const Role = require('../models/Role')


class RoleController{

    /**
     * @desc    Créer une nouvelle role
     * @route   POST /api/roles
     * @access  Private (à définir plus tard)
     */
    createRole = catchAsync(async (req, res, next) => {
        const performingUserId = req.user.id_user;
        const newRole = await RoleService.create(req.body,performingUserId);
        res.status(201).json({
            status: 'success',
            data: {
                role: newRole

            }
        });
    });

    /**
     * @desc    Récupérer tous les roles
     * @route   GET /api/Roles
     * @access  Public
     */
    getAllRoles = catchAsync(async (req, res, next) => {
        const roles = await RoleService.getAll();
        res.status(200).json({
            status: 'success',
            results: roles.length,
            data: {
                roles: roles
            }
        });
    });

    /**
     * @desc    Récupérer une role par son ID
     * @route   GET /api/roles/:id
     * @access  Private
     */
    getRoleById = catchAsync(async (req, res, next) => {
        const role = await RoleService.getoneById(req.params.roleId);
        res.status(200).json({
            status: 'success',
            data: {
                role: role
            }
        });
    });

    /**
     * @desc    modifier un d'un role
     * @route   PUT /api/roles/:roleId
     * @access  Private
     */
    updateRole = catchAsync(async (req,res,next)=> {
        const {roleId} = req.params;
        const performingUserId = req.user.id_user;



        const result = await RoleService.update(roleId,req.body,performingUserId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

    /**
     * @desc    supprimer un role
     * @route   DELETE  /api/roles/:roleId
     * @access  Private
     */
    deleteRole = catchAsync(async (req,res,next)=> {
        const {roleId} = req.params;
        const result = await RoleService.delete(roleId);
        res.status(200).json({
            status: 'success',
            data: result
        });

    });

}

module.exports = new RoleController();
