var duration : float = 1.0f;

function Update () {
	var phi : float = Time.time / duration * 2 * Mathf.PI;
	var amplitude : float = Mathf.Cos(phi) * 0.5F + 0.5F;
	light.intensity = 8*amplitude+2;
}