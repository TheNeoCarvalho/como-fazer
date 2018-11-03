const axios = require('axios')

const baseUrl = 'https://como-fazer-manolo.firebaseio.com/'

const list = async (key) => {

const content = await axios.get(baseUrl+key+'.json')
    
    if(content.data){
        const objetos = Object
                            .keys(content.data)
                            .map(key => {
                                return {
                                    id: key,
                                    ...content.data[key]
                                }	
                            })
        return objetos
    }
    return []
}

const apagar = async (key, id) => {
	await axios.delete(baseUrl+key+'/'+id+'.json')
	return true
}

const Patualiza = async (key, id) => {
	const content = await axios.get(baseUrl+key+'/'+id+'.json')
	return {	
		id: id,
		...content.data
	}
}

const atualiza = async (key, id, data) => {
	 await axios.put(baseUrl+key+'/'+id+'.json', data)
	 return true
}


module.exports = {
	list,
	apagar,
	Patualiza,
	atualiza
}