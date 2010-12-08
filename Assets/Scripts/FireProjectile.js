var CannonBall : GameObject;
var speed = 8.5;
var reloadTime = 2.0;
private var timeSinceLastShot = 0.0;
private var reloading = false;



function ShootCannon ()
{
	if(reloading) {
		if(Time.time >= timeSinceLastShot + reloadTime) {
			reloading = false;
		}
	}
	
	if(!reloading) {
		reloading = true;
		timeSinceLastShot = Time.time;
		var newPos : Vector3 = transform.position + 0.8 * transform.forward;
		newPos.y += 0.15;
		var cannonBallClone : GameObject = Instantiate(CannonBall, newPos, transform.rotation);
		cannonBallClone.GetComponent("ProjectileOwner").owner = gameObject;
		cannonBallClone.rigidbody.velocity = transform.forward * speed;
	}
}
