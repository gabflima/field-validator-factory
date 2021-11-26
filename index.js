// The object containing all the validators and the validate() method
const ValidatorManager = Object.create(null);


/*  Exceptions  */
function ValidatorBuilderFunctionNotFound(message) {
   this.message = message;
   this.name = "ValidatorBuilderFunctionNotFound";
}

function InvalidValidator(message) {
   this.message = message;
   this.name = "InvalidValidator";
}


/*  Factory  */
function FieldValidatorFactory(validatorBuilder, args){
	if(validatorBuilder.onValidate == undefined){
		throw new ValidatorBuilderFunctionNotFound("validatorBuilder.onValidate.");
	} else if(validatorBuilder.block == undefined){
		throw new ValidatorBuilderFunctionNotFound("validatorBuilder.block.");
	} else if(validatorBuilder.build == undefined){
		throw new ValidatorBuilderFunctionNotFound("validatorBuilder.build.");
	}
	
	let validator = validatorBuilder.build(args);
	if(validator == null){
		throw new InvalidValidator("validatorBuilder.build return null.");
	}
	
	if(ValidatorManager.validate == undefined){
		validator = Object.assign(ValidatorManager, validator, {
			validatorStore: [],
			validate(){ // Start the validation process. 
			            // Pass the validators with errors to this.onValidate.
				    // @return {Boolean} If the process was sucessful.
				let validatorsWithError = [];
				let counter = 0, lastCounterValue = 0;
				for(let i = 0; i < this.validatorStore.length; i++){
					const validator = this.validatorStore[i];
					counter = validator.onValidate(counter);
					
					if(counter != lastCounterValue){
						validatorsWithError.push(validator);
						lastCounterValue = counter;
					}
				}
				return this.onValidate(validatorsWithError);
			}
		});
	}else{
		ValidatorManager.validatorStore.push(validator);
	}
	validator.onValidate = validatorBuilder.onValidate;
	if(validatorBuilder.afterBuild != undefined){
		validatorBuilder.afterBuild(validator, args);
	}
	
	validatorBuilder.block(validator);
}
