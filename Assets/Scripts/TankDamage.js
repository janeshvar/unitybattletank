var health : int = 2;
var score : int = 0;

function HandleCollision(otherGameObject : GameObject) {
	if(otherGameObject.tag == "Projectile") {
		var ownerComp : ProjectileOwner = otherGameObject.GetComponent(ProjectileOwner);
		if(ownerComp && ownerComp.owner != gameObject) { // if we didn't fire the projectile
			Destroy(otherGameObject); // delete the projectile
			health--;
		}
	}
		
	if(health <= 0) {
		Destroy(gameObject);
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