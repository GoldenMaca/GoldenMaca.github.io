# Encryption Activity Reflection


## Part 1: Key Exchange

My Key: 7
My Partner's Key: 6

Our initial shared key: 6 + 7 = 13

## Part 2: Messaging

Complete this table with each of your messages. This should 
include the entire conversation - the messages that you sent
and the messages that you received.

(If you used something other than the caesar cipher here, describe what you did)

| Encoded Message | Decoded Message | Key |
| --------------- | --------------- | --- |
| Qrbqrenag       | Deoderant       | 13  |
| Wifiahy         | Cologne         | 20  |
| Spwwz Espcp!    | Hello There!    | 15  |
| hahahhah        | hahahhah        | 0   |


## Part 3: Connection to TCP/IP Model

### Application Layer: Turn your message into binary

Everything we've done in this activity takes place in the application layer. By the time the message leaves the application
layer, it is encoded in binary. We've been working with text for this activity for convenience, but let's see what the binary
looks like.

Go back to the first encrypted message that you sent (it should be in `rsa_encryption_activity/send/encrypted_message.b64`).

This message is represented as a string of letters, numbers, and symbols. But we know that the real message is in binary.

Select the first six characters from this message and copy them here: 01101100 01000100 01001001 01101011 01101101 00110111

Using the ASCII table, convert these five characters to binary (if necessary,
include leading zeroes so that each character is 8 bits): 

### Transport Layer: Break your message into packets

Assume that each packet can hold two bytes. Fill in the packet information below with the binary values you computed above.

    =========
    Packet 1:

    Source: Ethan
    Destination: Colin 
    Sequence: 1/3
    Data: 01000100 01100101
    =========
    Packet 2: 

    Source: Ethan
    Destination: Colin
    Sequence: 2/3 
    Data: 01101111 01100100
    =========
    Packet 3:

    Source: Ethan
    Destination: Colin
    Sequence: 3/3
    Data: 01100101 01110010
    =========

## Part 4: Reflection Questions

- What is the difference between symmetric and asymmetric encryption? What purpose did each serve in this simulation?

Symmetric encryption is when people have a shared key and if the key is found, the message is decoded.
Asymmetric encryption is when you decode with a public key and decode with a private key, making it slower but more protected.

- Why is it important that this protocol uses a new key for each message?

If the key is found, the future messages are still protected.

- Why is it important that you never share your secret key?

So that hackers can not decode all of the messages sent to you through a public key.

- In the transport layer, do these messages use TCP or UDP? Why?

TCP because the message needs to be accurate, the UDP protocol is not neccesary, as you want a full and complete message. 

- Now that you've created packets in the transport layer, give a short explanation of what happens to these packets in the internet layer and in the link layer.

In the internet layer, a routing table is made to send your message through binary to the receiver.

- This protocol successfully encrypts the **content** of the message. Even though and adversary in the middle can't read the content of the message, what other
information can they still see?

They can see who the sener what, who it was intended for, the time and the key used to encrpt the message.