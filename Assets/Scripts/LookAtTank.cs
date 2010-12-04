using UnityEngine;
using System.Collections;
	
public class LookAtTank : MonoBehaviour {

	public Transform target;
	public float duration = 1.0f;
	public float offset = 0.31f;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if(target == null) {
			Destroy(gameObject);
			return;
		}
		
		Vector3 position = new Vector3(target.position.x + target.forward.x * offset, target.position.y, target.position.z + target.forward.z * offset);
		transform.LookAt(position);
		transform.position = new Vector3(position.x, position.y + 5, position.z);
		
		float phi = Time.time / duration * 2 * Mathf.PI;
		float amplitude = Mathf.Cos(phi) * 0.5F + 0.5F;
		light.intensity = 8*amplitude+2;
	}
}
