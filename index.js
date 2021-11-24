const ValidatorManager = Object.create(null);

function FieldValidatorFactory(builder, args){
	if(builder.onValidate == undefined || builder.block == undefined){
		return;
	}
	
	let objBuilt = builder.build(args);
	if(objBuilt == null){
		return;
	}
	
	let finalObject = null;
	
	if(ValidatorManager.validate == undefined){
		Object.assign(ValidatorManager, objBuilt, {
			store: [],
			validate(){
				let first = null;
				let counter = 0, lastCounterValue = 0;
				let validator = null;
				for(let i = 0; i < this.store.length; i++){
					validator = this.store[i];
					counter = validator.onValidate(counter);
					if(counter != lastCounterValue){
						lastCounterValue = counter;
						if(first == null){
							first = validator;
						}
					}
				}
				return this.onValidate(first);
			}
		});
		finalObject = ValidatorManager;
	}else{
		finalObject = ValidatorManager.store[ValidatorManager.store.push(objBuilt) - 1];
	}
	finalObject.onValidate = builder.onValidate;
	
	if(builder.afterFieldFactory != undefined){
		builder.afterFieldFactory(finalObject, args);
	}
	builder.block(finalObject);
}
