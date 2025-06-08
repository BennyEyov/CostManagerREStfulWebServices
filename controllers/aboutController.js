/**
 * @module controllers/aboutController
 * @description Controller for handling requests related to team information.
 */

/**
 * GET /about
 * Sends information about the development team.
 *
 * @function
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {void} Responds with a JSON array of team members.
 */
const getTeamInfo = (req,res) =>{
    const team = [
        {first_name: 'Vlad', last_name: 'Yatchenko'},
        {first_name: 'Benny', last_name: 'Eyov'}
    ];

    res.json(team);
};

module.exports = {getTeamInfo};