const ProfileModel = require("./ProfileModel");

class ProfileService {

    async addAddress (data,res) {
        const {location, name, phoneNo, user} = data;
        if(!location || !name || !phoneNo){
            res.status(400);
            throw new Error("Provide all fields")
        };
        const profile = await ProfileModel.findOne({user});
        if(!profile){
            res.status(404);
            throw new Error("No profile found")
        }
        const address = {location,name,phoneNo};
        profile.address.push(address);
        await profile.save();
        return address;
    }

    async editAddress (data,res,id) {
        const {location, name, phoneNo, user} = data;
        if(!location || !name || !phoneNo) return false;
        const profile = await ProfileModel.findOne({user});
        let index = 0;
        const findAddress = profile.address.find((address,i) => {
            index = i
            // console.log(address._id.toString(),id);
            return address._id.toString() == id
        });
        if(!findAddress){
            res.status(404);
            throw new Error(`No address with id - ${id}`);
        }
        profile.address[index] = {location,name,phoneNo};
        await profile.save();
        return {location,name,phoneNo};
    }

    async deleteAddress (user,res,id) {
        const profile = await ProfileModel.findOne({user});
        let index = 0;
        const findAddress = profile.address.find((address,i) => {
            index = i;
            return address._id.toString() !== id
        });
        if(!findAddress){
            res.status(404);
            throw new Error(`No address with id - ${id}`);
        }
        // fix this
        profile.address.splice(index,1);
        await profile.save();
        return true
    }

    async getAddress (user) {
        const profile = await ProfileModel.findOne({user});
        if(!profile){
            res.status(404);
            throw new Error("Invalid Profile");
        }
        return profile.address;
    }

}

module.exports = ProfileService;