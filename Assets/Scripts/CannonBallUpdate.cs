using UnityEngine;
using System.Collections;

public class CannonBallUpdate : MonoBehaviour {

	public int lifetime = 2;
	
	// Use this for initialization
	void Start () {
			print(GetInstanceID());
			Destroy(gameObject, 3);
	}
	
	// Update is called once per frame
	void Update () {
		
	}
	
	void OnCollisionEnter(Collision collision) {
		Destroy(gameObject);
	}
	
}
