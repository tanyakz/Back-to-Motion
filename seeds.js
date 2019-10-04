var mongoose = require("mongoose");
var Service = require("./models/service");
var Comment   = require("./models/comment");

var data = [
    {
        title: "Back Pain", 
        image: "https://www.backtomotion.ca/Landing-Page/images/backpain-backtomotion.jpg",
        description: "DID YOU KNOW that Manual Osteopathy is the most effective and one of the best options available in treating CHRONIC BACK PAIN.Back problems are among the most common chronic conditions in Canada. 4 adults out of five experience back pain at some time in their lives. Manual Osteopathy practitioners relieve low back pain using effective clinical tools such as mobilization, muscle energy technique, soft tissue therapy, exercise, and patient education.There are numerous simple strategies that can help preventing the onset of back pain. Among them: >> Maintain a healthy diet and weight. >>Stay active and avoid prolonged inactivity. >>Warm up before exercising or physical activities. >>Proper posture, especially when lifting a heavy object. >>Quit smoking. >>Exercises- doing regular stretches to muscles, tendons, and ligaments are an important element of all back exercises. It reduces tension in muscles, improves range of motion and mobility. Remember, if you do not have any back pain, it’s still a great idea to do couple of these stretches to prevent any back pain: 1/Child pose 2/Single knee to chest 3/Sphinx stretch 4/Piriformis muscle stretch 5/back to motion-back pain exercises-chronic back pain. Visit us at www.backtomotion.ca and book your first Manual Osteopathy assessment to get relief from your pain and get Back to Motion."
    },
    {
        title: "Knee Pain", 
        image: "https://www.backtomotion.ca/Landing-Page/images/kneepain-backtomotion.jpg",
        description: "Knee pain can be due to an injury, a mechanical problem, or even types of arthritis which affects people of all ages. Since knee is a weight-bearing joint, any of the mentioned conditions can affect biomechanics of the lower back, hip, leg and ankle. Manual Osteopathy practitioners assist the joint and muscle imbalances of the knee which results in decreased pain and increase in function. The practitioner looks at how the knee is being influenced from ankle, foot, hip and the lower back and use Mobilization or Muscle Energy Technique to stretch muscles, improve joint movement, reduce inflammation, and promote healing."
    }
]

function seedDB(){
   //Remove all campgrounds
   Service.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed services!");
         //add a few campgrounds
        data.forEach(function(seed){
            Service.create(seed, function(err, service){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a service");
                    //create a comment
                    Comment.create(
                        {
                            text: "I had a severe injuries that they helped me and I'm pain free now ",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                service.comments.push(comment);
                                service.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;