## Credit System

Need a way to assign a credit system to reviewers and reviewees. 

This should look like the following:

An existing user, Bob
a new user, Alice

Alice wants to recieve feedback on her resume. Bob is the one to give it.

Alice should start off with a count of 2 

When she receives feedback from Bob, Bob's count should increase by 1, Alice's count should decrease by 1.

So:

{
    user: bob,
    count: 5,
}


{
    user: Alice,
    count: 2,
}

After review:

{
    user: bob,
    count: 6,
}


{
    user: Alice,
    count: 1,
}


what should happen:

Credit is given by either bob or Alice

-1 from Alice 
+1 to bob

looks like a transactions 


Probably happens on the object that is being created



