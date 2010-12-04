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
		var cannonBallClone : GameObject = Instantiate(CannonBall, transform.position, transform.rotation);
		cannonBallClone.GetComponent("ProjectileOwner").owner = gameObject;
		cannonBallClone.rigidbody.velocity = transform.forward * speed;
	}
}

function Update ()
{
    if (Input.GetButtonDown("Fire1") || Input.GetButtonDown("Jump")) {
        ShootCannon();
    }
}