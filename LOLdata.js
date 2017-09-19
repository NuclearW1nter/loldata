// Justin Plassmeyer

//senarios
// '/' allows them to see a list of available routes
// '/class' allows them to only get the requirements to find the requirments for the class match up
// '/classes/:classid/vs/:classid2' allows people to get a matchup of classes
// '/champ/difficult/:champid' lets you get a list of  difficult champs, add a champ, make your own list, and delete champs from the list
// '/champ/:champid' allows you to see the info for a champ
// '/cleanup' cleans the list ,makes sure their are only actual champs, of difficult champs or creates it if their are none 
// '/tank' looks up and finds how many tanks their are based upon health and defense


const express = require('express');
const app = express();
var scs;
var fetch = require('node-fetch');
var list_champs;
fetch('http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
    .then(res => res.json())
    .then(json => scs = json)
    .then( _ => console.log(scs));

app.get('/', function (req,res) {
    res.send("Please enter one of the choices: '/champ/:champid' , or /class, or  /champ/difficult/:champid, /cleanup");

});

app.route('/tank')
    .get(function (req, res) {
        var total_high_hp = new LoL_Data(scs).Base_stats_of_champ("hp");
        var good_defence = new LoL_Data(scs).Info_Of_champs("defense");
        var total_good_defence = good_defence.length;
        if (total_good_defence > total_high_hp)
        {
            res.send(`Based on our calculation their are ${total_high_hp} Tanks`);
        }
        else if (total_high_hp > total_good_defence)
        {
            res.send(`Based on our calculation their are ${total_good_defence} Tanks`);
        }
        else
        {
            res.send(`Based on my calculation their are ${total_good_defence} Tanks`);
        }
    })
    .post(function (req, res) {
        res.send("There is no need to Post here.")

    })
    .put(function (req, res) {
        res.send("There is no need to Put here.")

    })
    .delete(function (req, res) {
        res.send("There is no need to Delete here.")

    });
app.route('/class')
    .get(function (req,res) {
        res.send("In the URL type /classes/:classid/vs/:classid2 with classid and classid2 are two different classes")
    })
    .post(function (req, res) {
        res.send("There is no need to Post here.")

    })
    .put(function (req, res) {
        res.send("There is no need to Put here.")

    })
    .delete(function (req, res) {
        res.send("There is no need to Delete here.")

    });
app.route('/classes/:classid/vs/:classid2')
    .get(function (req,res) {
        var class_one = new LoL_Data(scs).Class_count(req.params.classid);
        var class_two = new LoL_Data(scs).Class_count(req.params.classid2);
        if (class_one > class_two)
        {
            res.send(`There are ${class_one - class_two} more ${req.params.classid} than ${req.params.classid2} `)
        }
        else {
            res.send(`There are ${class_two - class_one} more ${req.params.classid2} than ${req.params.classid} `)
        }
    })
    .post(function (req, res) {
        res.send("There is no need to Post here.")

    })
    .put(function (req, res) {
        res.send("There is no need to Put here.")

    })
    .delete(function (req, res) {
        res.send("There is no need to Delete here.")

    });

app.route('/champ/difficult/:champid')
    .get (function(req,res){
        let found = 0;
        if (typeof(list_champs) == 'undefined')
        {
            list_champs =  new LoL_Data(scs).Info_Of_champs("difficulty")
        }
        for (let iterator of list_champs )
        {
            if (iterator == req.params.champid) {
                res.send(`${req.params.champid} is a very difficult champ.\n`  +`Here is a list of the rest of the difficult champs ${list_champs}`);
                found = 1;
            }
        }
        if (found == 0)
        {
            res.send(`${req.params.champid} is a not a difficult champ.`);
        }

    })
    .post (function (req , res) {
        champinit = 0;
        if (typeof(list_champs) == 'undefined')
        {
            list_champs =  new LoL_Data(scs).Info_Of_champs("difficulty");
        }
        console.log(list_champs)
        for (let champs_inlist of list_champs)
        {
            if(champs_inlist == req.params.champid)
            {
                res.send("Champ is already added");
                champinit = 1;
            }
        }
        if (champinit == 0) {
            list_champs.push(req.params.champid);
            res.send(`${req.params.champid} is now on the difficult champ list ${list_champs}`);
        }
    })
    .delete(function (req, res)
    {
        if (typeof(list_champs) == 'undefined')
        {
            list_champs =  new LoL_Data(scs).Info_Of_champs("difficulty");
        }
        list_champs.pop(req.params.champid);
        res.send(`${req.params.champid} has been removed form the list at your request.`);
    })
    .put(function (req,res) {
        if (typeof(list_champs) == 'undefined')
        {
            list_champs =  new LoL_Data(scs).Info_Of_champs("difficulty")
        }
        let list_length = list_champs.length;
        for (let iter = 0; iter<list_length; iter++)
        {
            list_champs.pop();
        }
        list_champs.push(req.params.champid);
        res.send("I guess that my list was not sufficient for you so now you have your own.");
    });
app.route('/champ/:champid')
    .get(function (req, res){
    res.send(( new LoL_Data(scs).Certain_champ(req.params.champid)));
})
    .post(function (req, res) {
        res.send("Sorry but no Posting any champs here.")

})
    .put(function (req, res) {
    res.send("Sorry but no Adding any champs here.")

})
    .delete(function (req, res) {
        res.send("Sorry but no Deleting and champs.")

    });


app.route('/cleanup')
    .get(function (req,res) {
        if (typeof(list_champs) == 'undefined')
        {
            list_champs =  new LoL_Data(scs).Info_Of_champs("difficulty");
            res.send(`There was no champ list yet so we created on for you  ${list_champs}`);
        }
        else
        {
            list_champs = new Cleaner(scs).Champ_clean_up(list_champs);
            res.send(`The champs list has been cleaned  ${list_champs}`);
        }
    })
    .post(function (req, res) {
        res.send("This is for cleaning up the champions list only.")

    })
    .put(function (req, res) {
        res.send("This is for cleaning up the champions list only.")

    })
    .delete(function (req, res) {
        res.send("This is for cleaning up the champions list only.")

    });

app.listen(3000, function () {
    console.log(' app listening on port 3000!')
});

class Cleaner {
    constructor(some_data)
    {
        this.champ_pure_data = some_data;
        for (let FirstLayer in this.champ_pure_data)
        {
            if (FirstLayer === "data")
            {
                this.League_champions = this.champ_pure_data[FirstLayer];
            }
        }
    }
    Champ_clean_up(array_with_champs)
    {
        var matched = 0;
        for (let champ_name of array_with_champs)
        {
            matched = 0;
            for (let actual_champ_name in this.League_champions)
            {
              if (champ_name == actual_champ_name)
              {
                  matched = 1;
              }
            }
            if (matched == 0)
            {
                array_with_champs.pop(champ_name);
            }
        }
    return array_with_champs;
    }

}

class LoL_Data {
    constructor (wanted_data){
        this.champ_data = wanted_data;
        for (let FirstLayer in this.champ_data)
        {
            if (FirstLayer === "data")
            {
                this.Lol_champs = this.champ_data[FirstLayer];
            }
        }
    }

    Class_count(class_wanted)
    {
        var Lol_champs;

        let total_of_class = 0;
        let class_to_find = class_wanted;
        for (let champ_name in this.Lol_champs)
        {
            let Specific_Champ =  this.Lol_champs[champ_name];
            for (var specific_info in Specific_Champ)
            {
                if (specific_info === "tags")
                {
                    for (let Class_found of Specific_Champ[specific_info])
                    {
                        if (Class_found == class_to_find)
                        {
                            total_of_class++;
                        }
                    }
                }
            }
        }
        return total_of_class;
    }
    Certain_champ(want_to_find)
    {
        for (let champ_name in this.Lol_champs)
        {
            if(champ_name == want_to_find)
            {
                return this.Lol_champs[champ_name];
            }
        }
    }
    Info_Of_champs(info_to_be_found)
    {
        var list_champ_names = [];
        for (let champ_name in this.Lol_champs)
        {
            let Specific_Champ =  this.Lol_champs[champ_name];
            for (var specific_info in Specific_Champ)
            {
                if (specific_info === "info")
                {
                    for (let info_found in Specific_Champ[specific_info])
                    {
                        if (info_found == "difficulty" && info_to_be_found == "difficulty")
                        {
                            if (Specific_Champ[specific_info][info_found] > 6)
                            {
                                list_champ_names.push(champ_name);
                            }
                        }
                        if (info_found == "attack" && info_to_be_found == "attack")
                        {
                            if (Specific_Champ[specific_info][info_found] <= 4)
                            {
                                list_champ_names.push(champ_name);
                            }
                        }
                        else if (info_found == "defense" && info_to_be_found == "defense")
                        {
                            if (Specific_Champ[specific_info][info_found] >= 6 )
                            {
                                list_champ_names.push(champ_name);
                            }
                        }
                    }
                }
            }
        }
        return list_champ_names;
    }

    Base_stats_of_champ(stat_to_find)
    {
        var total_stf = 0;
        for (let champ_name in this.Lol_champs)
        {
            let Specific_Champ =  this.Lol_champs[champ_name];
            for (var specific_info in Specific_Champ)
            {
                if (specific_info === "stats")
                {
                    for (let stat_found in Specific_Champ[specific_info])
                    {
                        if (stat_found == "hp" && stat_to_find == "hp")
                        {
                            if (Specific_Champ[specific_info][stat_found] > 600)
                            {
                                total_stf++;
                            }
                        }
                        if (stat_found == "mpperlevel" && stat_to_find == "mpperlevel")
                        {
                            if (Specific_Champ[specific_info][stat_found] > 0.5) { total_stf++; }
                        }
                    }
                }
            }
        }
        return total_stf;
    }
}
