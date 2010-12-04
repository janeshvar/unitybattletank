var health : int = 2;
var score : int = 0;
var maxHealth : int = 2;

var respawn1 : GameObject;
var respawn2 : GameObject;

function HandleCollision(otherGameObject : GameObject) {
	if(otherGameObject.tag == "Projectile") {
		var ownerComp : ProjectileOwner = otherGameObject.GetComponent(ProjectileOwner);
		if(ownerComp && ownerComp.owner != gameObject) { // if we didn't fire the projectile
			Destroy(otherGameObject); // delete the projectile
			health--;
		}
	}
		
	if(health <= 0) {
		//Destroy(gameObject);
		respawn(ownerComp.owner);
		var ownerTank : TankDamage = ownerComp.owner.GetComponent(TankDamage);
		if(ownerTank)
			ownerTank.score++;
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit) {
	HandleCollision(hit.gameObject);
}

function OnCollisionEnter(collision : Collision) {
	HandleCollision(collision.gameObject);
}

function respawn(otherTank : GameObject) {
	var largestDistance : float;
	var useFirst : boolean = true;
	var useSecond : boolean = false;
	if(respawn1) {
		largestDistance = Vector3.Distance(respawn1.transform.position, otherTank.transform.position);
	} else
		useFirst = false;
		
	if(respawn2) {
		if(Vector3.Distance(respawn2.transform.position, otherTank.transform.position) > largestDistance) {
			useFirst = false;
			useSecond = true;
		}
	} else
		useSecond = false;
	
	if(useFirst) {
		transform.position = respawn1.transform.position;
	}
	
	if(useSecond) {
		transform.position = respawn2.transform.position;
	}
	
	health = maxHealth;
}