const getTeamInfo = (req,res) =>{
    const team = [
        {first_name: 'Vlad', last_name: 'Yatchenko'},
        {first_name: 'John', last_name: 'Doe'}
    ];

    res.json(team);
};

module.exports = {getTeamInfo};