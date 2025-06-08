const getTeamInfo = (req,res) =>{
    const team = [
        {first_name: 'Vlad', last_name: 'Yatchenko'},
        {first_name: 'Benny', last_name: 'Eyov'}
    ];

    res.json(team);
};

module.exports = {getTeamInfo};